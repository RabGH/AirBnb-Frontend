import { sanityClient } from "../../../sanity";
import { isMultiple } from "../../../utils";

interface Review {
  _key: string;
  _type: string;
  rating: number;
  reviewDescription: string;
  traveller: {
    _key: string;
    _type: string;
    name: string;
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
  description: number;

  location?: {
    lat?: number;
    lng?: number;
  };

  host?: {
     name?: string;
  };

  reviews?: Array<Review>
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
      <h2><b>{propertyType} hosted by {host?.name}</b></h2>
      <h4>{bedrooms} bedroom{isMultiple(bedrooms)} * {beds} bed{isMultiple(beds)}</h4>
      <hr />
      <h4><b>Enhanced Clean</b></h4>
      <p>This host is commited to Airbnb&apos;s 5-step enhanced cleaning process.</p>
      <h4><b>Amenities for everyday living</b></h4>
      <p>The host has equipped this place for long stays - kitchen, shampoo, conditioner, hairdryer included</p>
      <h4><b>House rules</b></h4>
      <p>This place isn&apos;t suitable for pets and the host does not allow parties or smoking.</p>
    
      <div className="price-box">
        <h2>${pricePerNight}</h2>
        <h4>{reviewAmount} review{isMultiple(reviewAmount)}</h4>
        <div className="button" onClick={() =>{}}>Change Dates</div>
      </div>

    </div>
  )
}

export const getServerSideProps = async (pageContext: PageContext) => {
  const pageSlug = pageContext.query.slug
  console.log(pageSlug)
  
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
  console.log(query)

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
        mainImage: property.mainImage,
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