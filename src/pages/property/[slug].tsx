import { sanityClient } from "../../../sanity";
import { isMultiple } from "../../../utils";
import ImageSlug from '../../components/ImageSlug'
import ReviewSlug from '../../components/ReviewSlug'

import dynamic from 'next/dynamic';
const MapSlug = dynamic(() => import('../../components/MapSlug'), {
  ssr: false,
});

interface Review {
  _key: string;
  _type: string;
  rating: number;
  reviewDescription: string;
  traveller: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    image: string;
  };
}

interface PageContext {
    query: {
        slug: string;
    }
}

interface PropertyProps {
  title: string;
  propertyType: string;
  mainImage: string;
  images: string[];
  pricePerNight: number;
  beds: number;
  bedrooms: number;
  description: string;

  location: {
    lat?: number;
    lng?: number;
  };

  host?: {
     name?: string;
  };

  reviews?: Review[] | undefined;
}

const Property = ({
    title,
    location,
    propertyType,
    mainImage,
    images,
    pricePerNight,
    beds,
    bedrooms,
    description,
    host,
    reviews,
  }: PropertyProps) => {

  const reviewAmount = reviews ? reviews.length : 0;


  return ( // we have hardcoded this next part when it would be better to be put into sanity instead 
    <div className="container" >
        <h1><b>{title}</b></h1>
        <p>{reviewAmount} review{isMultiple(reviewAmount)}</p>
        <div className="image-section">
          <ImageSlug identifier="main-image" image={mainImage} />
          <div className="sub-image-section">
          {images.map((image, index) => <ImageSlug key={index} identifier="sub-image" image={image} />)}
          </div>
        </div>

      <div className="section">
          <div className="information">
            <h2><b>{propertyType} hosted by {host?.name}</b></h2>
            <h4>{bedrooms} bedroom{isMultiple(bedrooms)} * {beds} bed{isMultiple(beds)}</h4>
            <hr />
            <h4><b>Enhanced Clean</b></h4>
            <p>This host is commited to Airbnb&apos;s 5-step enhanced cleaning process.</p>
            <h4><b>Amenities for everyday living</b></h4>
            <p>The host has equipped this place for long stays - kitchen, shampoo, conditioner, hairdryer included</p>
            <h4><b>House rules</b></h4>
            <p>This place isn&apos;t suitable for pets and the host does not allow parties or smoking.</p>
          </div>
          <div className="price-box">
              <h2>${pricePerNight}</h2>
              <h4>{reviewAmount} review{isMultiple(reviewAmount)}</h4>
              <div className="button" onClick={() =>{}}>Change Dates</div>
          </div>
      </div>

      <hr />

      <h4>{description}</h4>

      <hr />

      <h2>{reviewAmount} review {isMultiple(reviewAmount)} </h2>
      {reviewAmount > 0 &&
       reviews && reviews.map((review) => <ReviewSlug key={review._key} review={review} />)}

       <hr />

       <h2>Location</h2>
       <MapSlug lat={location?.lat || 0} lng={location?.lng || 0} />


    </div>
  )
}

export const getServerSideProps = async (pageContext: PageContext) => {
  const pageSlug = pageContext.query.slug
  
  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    title,
    location,
    propertyType,
    mainImage,
    images,
    pricePerNight,
    beds,
    bedrooms,
    description,
    host->{
      _id,
      name,
      slug,
      image
    },
    reviews[]{
      ...,
      traveller->{
        _id,
        name,
        slug,
        image
      }
    }
  }`

  const property = await sanityClient.fetch(query, {pageSlug})
  if (!property) {
    return {
      props: null,
      notFound: true,
    }
  } else {
    return {
      props: {
        title: property.title,
        location: property.location,
        propertyType: property.propertyType,
        mainImage: property.mainImage || null,
        images: property.images,
        pricePerNight: property.pricePerNight,
        beds: property.beds,
        bedrooms: property.bedrooms,
        description: property.description,
        host: property.host,
        reviews: property.reviews,
      }
    }
  }
}

export default Property