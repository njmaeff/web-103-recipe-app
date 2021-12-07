import {addUserByEmail, connectFirebaseAdmin,} from "./connect-admin";
import {
    CollectionReference,
    DocumentReference,
    getFirestore,
} from "firebase-admin/firestore";
import {testEmail, testPassword} from "./setup";
import type {RecipeDoc} from "../pages/app-recipe/lib/types";

const seed = async () => {
    connectFirebaseAdmin();
    try {
        const user = await addUserByEmail(testEmail, testPassword, {
            displayName: "Test User",
        });
        const db = getFirestore();
        const userCollection = db.collection(`users`);

        // create employers
        const recipes: RecipeDoc[] = [
            {
                name: 'toast and jam',
                directions: "put bread in the toaster and spread jam on the toast",
                ingredients: [
                    {
                        name: 'bread',
                        amount: '1 slice'
                    },
                    {
                        name: "jam",
                        amount: "to taste"
                    }
                ]
            },
            {
                name: "cereal",
                directions: "pour cereal into a bowl and then add milk and honey",
                ingredients: [
                    {
                        name: "cereal",
                        amount: "1 cup"
                    },
                    {
                        name: "milk",
                        amount: "1/2 cup"
                    },
                    {
                        name: "honey",
                        amount: "to taste"
                    }
                ]
            },
            {
                name: "rice",
                directions: "bring rice to a boil and then simmer for 40 minutes",
                ingredients: [
                    {
                        name: "rice",
                        amount: "1 cup"
                    },
                    {
                        name: "water",
                        amount: "2 cups"
                    }
                ]
            }
        ]

        const userPath = userCollection.doc(user.uid);
        const recipesPath = userPath.collection("recipes");

        await createDocsFromData(recipesPath, recipes);

    } catch (e) {
        console.error(e);
    }
};

if (require.main) {
    seed().catch((e) => console.error(e));
}

export const createDocsFromData = <T extends any[]>(
    collection: CollectionReference,
    docs: T
): Promise<DocumentReference[]> => {
    return Promise.all(
        docs.map(async (doc) => {
            const docRef = collection.doc();
            await docRef.create(doc);
            return docRef;
        })
    );
};

export const mapEachDoc = async (
    docs: DocumentReference[],
    fn: (docRef: DocumentReference) => Promise<DocumentReference[]>
) => {
    return (await Promise.all(docs.map((doc) => fn(doc))))[0];
};
