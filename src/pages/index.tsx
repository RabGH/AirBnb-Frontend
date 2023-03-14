import { sanityClient } from '../../sanity'

interface Property {
  title: string;
  description: string;
}

interface SanityHome {
  properties: Property[];
}

const Home = ({ properties }: SanityHome) => {
  return (
    <>
      
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]'
  const properties = await sanityClient.fetch(query)

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