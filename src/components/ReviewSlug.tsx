import { urlFor } from "../../sanity";
import Image from "next/image";

type Props = {
  review?: {
    rating: number;
    traveller: {
      name: string;
      image: string;
    };
  };
};

const ReviewSlug = ({ review }: Props) => {
    // console.log("props:", review);
  if (!review) {
    // console.log("Review not found.");
    return <div>No review found.</div>;
  }

  const { rating, traveller } = review;
  const { name, image } = traveller;

  return (
    <div className="review-box">
      <h1>{rating}</h1>
      <h2>{name}</h2>
      <Image
        className="review-image"
        src={urlFor(image).width(50).height(50).crop("focalpoint").auto("format").url()}
        width={50}
        height={50}
        alt={`${name}'s profile picture`}
      />
    </div>
  );
};

export default ReviewSlug;
