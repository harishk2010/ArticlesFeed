import { Schema, model, Document, Types } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  blocks: Types.ObjectId[];
}

const articleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  imageUrl: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  blocks: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

export const Article = model<IArticle>('Article', articleSchema); 