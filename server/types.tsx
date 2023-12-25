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
    bookThumbnail: string,
    timeStampNum: number,
    likers: string [],
    disLikers: string[]
    edited: boolean
}

export type reply = {
    replyId: string,
    postId: string,
    posterId: string,
    timestamp: string,
    timeStampNum: number,
    likers: string [],
    disLikers: string[],
    body: string,
    edited: boolean

}