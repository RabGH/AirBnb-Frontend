import { sanityClient, urlFor } from '../../sanity'
import { isMultiple } from '../../utils';
import Image from 'next/image'
import Link from 'next/link'

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

interface Property {
  title: string;
  pricePerNight: number;
  _id: string;
  mainImage?: string;
  slug: {
    current: string;
  }
  reviews: Review[];
}

interface HomeProps {
  properties: Property[];
}


const Home = ({ properties }: HomeProps) => {

  return (
    <>
      {properties && (
        <div className='main'>
          <div className='feed-container'>
            <h1>Places to stay near you</h1>
            <div className='feed'>
              {properties.map((property, index) => (
                  <Link className='home-link' href={`property/${property.slug.current}`} key={property._id} >
                    <div key={property._id} className='card'>
                      {property.mainImage && (
                        <Image src={urlFor(property.mainImage).auto('format').url()} alt="" width={800} height={600} />
                      )}
                      <p>{property.reviews.length} review{isMultiple(property.reviews.length)}</p>
                      <h3>{property.title}</h3>
                      <h4>${property.pricePerNight} /per Night</h4>
                      <hr />
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]'
  const properties = await sanityClient.fetch(query)
  console.log(urlFor(properties[0].mainImage).auto('format').url());

  console.log(properties)
  console.log(properties[0].reviews[0].rating);


  if (!properties.length) {
    return {
      props: {
        properties: [],
      },
    }
  } else {
    return {
      props: {
        properties
      }
    }
  }
}


export default Home;