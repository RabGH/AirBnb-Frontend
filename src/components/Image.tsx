import { urlFor } from '../../sanity'


const Image = ({ identifier, image }: { identifier: string, image: string }) => {
    return (
        <div className={identifier === "main-image" ? "main-image" : "image"}>
            <img src={urlFor(image).auto('format')} />
        </div>
    )
}

export default Image;