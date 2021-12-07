import React, {useState} from "react";
import {useFirebaseUI} from "./lib/use-firebase-ui";
import {connectFirestore} from "./lib/connect-firestore-compat";
import firebase from "firebase/compat/app";
import {usePromise} from "./lib/usePromise";
import {Ingredient, RecipeDoc} from "./lib/types";

type User = firebase.User

export const firestore = connectFirestore();

export const Modal = ({text, title}) => {
    return (
        <div
            className="modal fade"
            id="validation-modal"
            tabIndex={-1}
            aria-labelledby="validation-modal-label"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="validation-modal-label">
                            {title}
                        </h5>
                    </div>
                    <div className="modal-body">{text}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const Loader = () => {
    return (
        <div
            className="d-flex justify-content-center"
            style={{height: "100vh"}}
        >
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "3rem",
                    height: "3rem",
                }}
            >
                <div className="spinner-border" role="status">
                    <span className="sr-only"/>
                </div>
            </div>
        </div>
    );
};
export const useDatabase = (user: User) => {
    const [data, updateData] = useState<RecipeDoc[]>([]);
    const userCollection = firestore.collection(`users/${user.uid}/recipes`);
    const loaded = usePromise(async () => {
        const snapshot =
            (await userCollection.get()) as firebase.firestore.QuerySnapshot<RecipeDoc>;
        updateData(
            snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            })
        );
    });

    const saveData = async (recipe: Omit<RecipeDoc, "id">) => {
        const docRef = await userCollection.doc();
        await docRef.set(recipe);
        updateData([...data, {...recipe, id: docRef.id}]);
    };

    const removeData = async (id: string) => {
        await userCollection.doc(id).delete();
        updateData(data.filter((recipe) => recipe.id !== id));
    };

    return [loaded, data, {saveData, removeData}] as const;
};
export const useRecipeInputs = () => {
    const [recipeInputs, updateRecipeInputs] = useState({
        name: "",
        directions: "",
    });

    const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        updateRecipeInputs({
            ...recipeInputs,
            [event.target.name]: event.target.value,
        });
    };

    return [recipeInputs, inputChangeHandler, updateRecipeInputs] as const;
};
export const IngredientTable = (props: { ingredients: Ingredient[] }) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope={"col"}>#</th>
                <th scope={"col"}>Name</th>
                <th scope={"col"}>Amount</th>
            </tr>
            </thead>
            <tbody>
            {props.ingredients.map((ingredient, index) => (
                <tr key={ingredient.name}>
                    <td>{index + 1}</td>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.amount}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
export const EditableIngredientTable = ({
                                            rows,
                                            updateRows,
                                        }: {
    rows: [string, string][];
    updateRows;
}) => {
    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th scope={"col"}>#</th>
                    <th scope={"col"}>Name</th>
                    <th scope={"col"}>Amount</th>
                    <th scope={"col"}>Action</th>
                </tr>
                </thead>
                <tbody>
                {rows.map(([name, amount], index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            <input
                                type="text"
                                className={`form-control ${
                                    !name ? "is-invalid" : "is-valid"
                                }`}
                                value={name}
                                placeholder={"Name"}
                                onChange={(e) => {
                                    rows[index][0] = e.target.value;
                                    updateRows([...rows]);
                                }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className={`form-control ${
                                    !amount ? "is-invalid" : "is-valid"
                                }`}
                                value={amount}
                                placeholder={"Amount"}
                                onChange={(e) => {
                                    rows[index][1] = e.target.value;
                                    updateRows([...rows]);
                                }}
                            />
                        </td>
                        <td>
                            {index !== 0 ? (
                                <button
                                    className="btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        delete rows[index];
                                        updateRows(
                                            rows.filter(
                                                (value) => value !== null
                                            )
                                        );
                                    }}
                                >
                                    {"\u2717"}
                                </button>
                            ) : null}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button
                className="btn btn-secondary"
                onClick={(e) => {
                    e.preventDefault();
                    updateRows([...rows, ["", ""]]);
                }}
            >
                Add Ingredient
            </button>
        </div>
    );
};

export interface InputOptions {
    value: string;
    help?: string;
    label?: string;
    name: string;
    placeholder: string;
    id: string;
    changeHandler;
}

export const InputFrom =
    (InputComponent) =>
        ({
             value,
             help,
             label,
             placeholder,
             id,
             changeHandler,
             name,
         }: InputOptions) => {
            const helpID = id + "-help";
            return (
                <div className="mb-3">
                    <label htmlFor={id} className="form-label">
                        {label}
                    </label>
                    <InputComponent
                        type="text"
                        className={`form-control ${
                            value ? "is-valid" : "is-invalid"
                        }`}
                        id={id}
                        value={value}
                        name={name}
                        placeholder={placeholder}
                        aria-describedby={helpID}
                        onChange={changeHandler}
                    />
                    <div id={helpID} className="form-text">
                        {help}
                    </div>
                </div>
            );
        };

export const RecipePost: React.FC<{ recipe: RecipeDoc; onRemove }> = ({
                                                                          recipe,
                                                                          onRemove,
                                                                      }) => {
    return (
        <article
            className="card text-white bg-dark m-2 mb-3"
            style={{maxWidth: "20rem"}}
        >
            <div className="card-header">{recipe.name}</div>
            <div className="card-body">
                <h5 className="card-title">Directions</h5>
                <p className="card-text">{recipe.directions}</p>
                <h5 className="card-title">Ingredients</h5>

                <IngredientTable ingredients={recipe.ingredients}/>
                <button
                    className={"btn btn-secondary"}
                    onClick={() => {
                        onRemove();
                    }}
                >
                    Remove
                </button>
            </div>
        </article>
    );
};

export const Input = InputFrom((props) => <input {...props} />);
export const TextArea = InputFrom((props) => <textarea {...props} />);
export const Main: React.FC<{ user: User; signOut }> = ({user, signOut}) => {
    const [loaded, data, {saveData, removeData}] = useDatabase(user);

    const [recipeInputs, recipeInputsHandler, updateRecipeInputs] =
        useRecipeInputs();

    const [ingredientsList, updateIngredientsList] = useState<[string, string][]>([["", ""]]);

    const isValidSubmit =
        ingredientsList.every(([name, amount]) => name && amount) &&
        recipeInputs.name &&
        recipeInputs.directions;

    return loaded ? (
        <div>
            <header>
                <h1>Recipe App</h1>
                <h2>Welcome {user.displayName}</h2>
                <button
                    className={"btn btn-primary"}
                    onClick={() => {
                        signOut();
                    }}
                >
                    Logout
                </button>
            </header>
            <main>
                <Modal
                    text="Please check the recipe inputs and make sure they are all entered!"
                    title="Missing Inputs!"
                />
                <form>
                    <div className={"mb-3"}>
                        <h2>Add Recipe</h2>
                        <Input
                            value={recipeInputs.name}
                            help={"Name of the recipe"}
                            label={"Name"}
                            name={"name"}
                            placeholder={"Recipe Name"}
                            id={"recipe-name"}
                            changeHandler={recipeInputsHandler}
                        />
                        <TextArea
                            value={recipeInputs.directions}
                            help={"Directions of the recipe"}
                            label={"Directions"}
                            name={"directions"}
                            placeholder={"Recipe Directions"}
                            id={"recipe-directions"}
                            changeHandler={recipeInputsHandler}
                        />
                    </div>
                    <div className={"mb-3"}>
                        <h2>Ingredients</h2>

                        <EditableIngredientTable
                            rows={ingredientsList}
                            updateRows={updateIngredientsList}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        {...(!isValidSubmit
                            ? {
                                "data-bs-toggle": "modal",
                                "data-bs-target": "#validation-modal",
                            }
                            : {})}
                        onClick={(e) => {
                            e.preventDefault();
                            // store data in the database
                            if (isValidSubmit) {
                                saveData({
                                    name: recipeInputs.name,
                                    directions: recipeInputs.directions,
                                    ingredients: ingredientsList
                                        .filter(
                                            ([name, amount]) => name && amount
                                        )
                                        .map(([name, amount]) => ({
                                            name,
                                            amount,
                                        })),
                                }).then(() => {
                                    updateIngredientsList([["", ""]]);
                                    updateRecipeInputs({
                                        name: "",
                                        directions: "",
                                    });
                                });
                            }
                        }}
                    >
                        Save Recipe
                    </button>
                </form>

                <section className={"container"}>
                    <h2 className={"mb-5"}>Recipes</h2>
                    <div className="d-flex flex-wrap">
                        {data.map((recipe) => (
                            <RecipePost
                                recipe={recipe}
                                onRemove={() => {
                                    removeData(recipe.id).catch((e) =>
                                        console.error(e)
                                    );
                                }}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    ) : (
        <Loader/>
    );
};

export const App = () => {
    const [{user, showLoginHeader}, {signOutUser}] = useFirebaseUI();

    return user ? (
        <Main user={user} signOut={signOutUser}/>
    ) : (
        <div className="login-container">
            {showLoginHeader ? (
                <h1 className={"text-center mb-5"}>Login</h1>
            ) : null}
            <div id={"firebaseui-auth-container"}/>
        </div>
    );
};
