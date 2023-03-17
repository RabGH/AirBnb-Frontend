import { sanityClient, urlFor } from '../../sanity'
import Image from 'next/image'

interface Property {
  _id: string;
  mainImage?: string;
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
                    {property.mainImage && (
                      <Image src={urlFor(property.mainImage).auto('format').url()} alt="" width={800} height={600} />
                    )}
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