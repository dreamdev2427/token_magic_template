import React from 'react';
import { useLottie } from "lottie-react";
import rocketAnim from "../../assets/lottie/rocket-anim.json";
import '../../assets/logo.scss';

const RocketAnim = () => {
  const options = {
    animationData: rocketAnim,
    loop: true,
    autoplay: true
  };

  const { View } = useLottie(options);

  return (
    <>
      {View}
    </>
  );
}

export default RocketAnim;