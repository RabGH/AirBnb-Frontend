import { sanityClient } from '../../sanity'


const Home = () => {
  return (
    <>
      
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]'
  const properties = await sanityClient.fetch(query)
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