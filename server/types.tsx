export type book = {
    volumeInfo: {
        title: string,
        subtitle: string,
        authors: string[],
        description: string,
        industryIdentifiers: {
            type:string,
            identifier: string
        } [],
        imageLinks: {
            smallThumbnail: string,
            thumbnail: string
        }

    }
}

export type profile = {
    displayName: string,
    uid: string,
    email: string,
    photoURL: string,
    bio: string,
    readingList: book[]
}

export type post = {
    postId: string,
    title: string,
    body: string,
    bookTitle: string,
    bookId: string,
    userId:string,
    userDisplayName: string,
    timestamp: string,
    likes: number,
    bookThumbnail: string,
    timeStampNum: number
}