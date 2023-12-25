export type book = {
    id: string,
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
    readingList: string[]
}


export type post = {
    postId: string,
    bookTitle: string,
    title: string,
    body: string,
    bookId: string,
    userId:string,
    userDisplayName: string,
    timestamp: string,
    bookThumbnail: string,
    timeStampNum: number,
    likers: string [],
    dislikers:string[],
    edited: boolean
}

export type reply = {
    replyId: string,
    postId: string,
    posterId: string,
    timestamp: string,
    timeStampNum: number,
    likers: string [],
    dislikers: string[],
    body: string,
    edited: boolean
}
