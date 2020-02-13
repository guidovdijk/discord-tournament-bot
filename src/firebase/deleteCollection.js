const deleteCollection = (db, collectionPath) => {
    let collectionRef = db.collection(collectionPath);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, collectionRef, resolve, reject);
    });
}

const deleteQueryBatch = (db, collectionRef, resolve, reject) => {
    collectionRef.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size == 0) {
                return 0;
            }

            // Delete documents in a batch
            let batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, collectionRef, resolve, reject);
            });
        })
        .catch(reject);
}

export default deleteCollection;