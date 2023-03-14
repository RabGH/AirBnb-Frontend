import { sanityClient } from "../../../sanity";

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

  return (
    <div className="container" >
      <h1><b>{ title }</b></h1>
      <h2><b>{propertyType} hosted by {host?.name}</b></h2>
      <h4>{bedrooms} bedroom * {beds} bed</h4>
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