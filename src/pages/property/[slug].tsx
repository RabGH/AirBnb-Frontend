import React from 'react';
import { getServerSideProps as indexPageServerSideProps } from '../index';
import { sanityClient } from '../../../sanity';

interface PageContext {
    query: {
        slug: string;
    }
}

interface SanityProperty {
    title: string;
    location: string;
    propertyType: string;
    mainImage: string;
    images: string;
    pricePerNight: number;
    beds: number;
    bedrooms: number;
    description: string;
    host: string;
    reviews: string;
}

const Property = ({ title }: SanityProperty) => {
    return (
        <h1>{title}</h1>
    );
};

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

    const property = await sanityClient.fetch(query, { pageSlug })

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
                reviews: property.reviews
            }
        }
    }
};

export default Property;