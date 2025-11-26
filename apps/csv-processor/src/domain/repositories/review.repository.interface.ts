import { Review } from '../entities/review.entity';

export interface IReviewRepository {
    createMany(reviews: Omit<Review, 'id'>[]): Promise<void>;
}
