import { sanityClient, urlFor } from '../../sanity'
import { isMultiple } from '../../utils';
import Image from 'next/image'
import Link from 'next/link'

import dynamic from 'next/dynamic';
const DashBoardMap = dynamic(() => import('../components/DashBoardMap'), {
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

interface Property {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  title: string;
  pricePerNight: number;
  mainImage?: string;
  slug: {
    current: string;
  }
  reviews: Review[];
  lat: number;
  lng: number;
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
                <div key={property._id} className='card'>
                  <Link className='home-link' href={`property/${property.slug.current}`}>
                    {property.mainImage && (
                      <Image src={urlFor(property.mainImage).auto('format').url()} alt="" width={800} height={600} />
                    )}
                    <p>{property.reviews.length} review{isMultiple(property.reviews.length)}</p>
                    <h3>{property.title}</h3>
                    <h4>${property.pricePerNight} /per Night</h4>
                    <hr />
                  </Link>
                  <DashBoardMap
                    lat={property.location.lat}
                    lng={property.location.lng}
                    properties={[property]}
                  />              
                </div>
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
  // console.log(urlFor(properties[0].mainImage).auto('format').url());

  // console.log(properties)
  // console.log(properties[0].reviews[0].rating);

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
