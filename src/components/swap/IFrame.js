import React from 'react';

const Iframe = ({ source }) => {

    if (!source) {
        return <div>Loading...</div>;
    }

    const src = source;
    return (
        <div className="emdeb-responsive">
            <iframe title="Exchange" src={src}></iframe>
        </div>
    );
};

export default Iframe;