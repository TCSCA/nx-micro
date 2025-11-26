export class Review {
    id: number;
    rating: number;
    title: string;
    content: string;

    constructor(id: number, rating: number, title: string, content: string) {
        this.id = id;
        this.rating = rating;
        this.title = title;
        this.content = content;
    }
}
