'use client'
import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import "slick-carousel/slick/slick.css";
import Link from 'next/link';
import "slick-carousel/slick/slick-theme.css";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react'

import ModuleCard from './CardModule';
import CardContents from './CardsContents';
import BlurText from '@/app/animationComponents/BlurText';

const sliderImages = [
  "/hr.png",
  "/training.svg",
  "/peer-to-peer1.png",
  "/time.svg",
  // ...Array(7).fill("/peer-to-peer1.png") // Repeats the same image 7 times
]

function Section2() {
  const sliderSettings = {
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }

  return (
    <div className="w-full bg-transparent   ">
      {/* Header Section */}
      {/* <h1 className="text-center text-white text-4xl font-bold py-10 bg-gradient-to-r from-[#3ffc2f] to-[#2f83c3] bg-clip-text text-transparent ">
        Módulos RH que atendem às suas necessidades
      </h1> */}

      <BlurText
        text="Módulos RH que atendem às suas necessidades"
        delay={150}
        animateBy="words"
        direction="top"
        className=" text-center items-center justify-center text-white text-4xl font-bold py-10"
        onAnimationComplete={() => {}}
      />

      {/* Slider Section */}

<div className=" bg-blue-200 mx-auto py-10 w-[94%] overflow-hidden">
  <div className="w-full max-w-[350px] md:max-w-3xl sm:max-w-[600px]  px-4 mx-auto">
    <Slider {...sliderSettings}>
      {sliderImages.map((src, index) => (
        <div key={index} className="px-2">
          <div className="flex justify-center">
            <Image 
              src={src} 
              alt={`Slide ${index + 1}`} 
              width={200} 
              height={100}
              className="object-contain w-full max-w-[200px]"
            />
          </div>
        </div>
      ))}
    </Slider>
  </div>
</div>

      {/* Module Cards Section */}
      <div className="container mx-auto px-4 py-10 mt-16 bg-transparent ">
        <div className="flex flex-wrap justify-center gap-8">
          <ModuleCard
          title={CardContents[0].title}
          description={CardContents[0].description}
          imageSrc={CardContents[0].imageSrc}
          link={`/modulos/${CardContents[0].title.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <ModuleCard
          title={CardContents[1].title}
          description={CardContents[1].description}
          imageSrc={CardContents[1].imageSrc}
          link={`/modulos/${CardContents[1].title.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <ModuleCard
          title={CardContents[2].title}
          description={CardContents[2].description}
          imageSrc={CardContents[2].imageSrc}
          link={`/modulos/${CardContents[2].title.toLowerCase().replace(/\s+/g, '-')}`}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-[#295ed7] p-7 rounded-2xl relative overflow-hidden">
          <div className="absolute bg-black w-[200px] h-[75px] top-0 right-0 opacity-20 rounded-b-full -mr-[90px]"></div>
          
          <div className="relative z-10">
            <h1 className="text-center text-3xl mt-10 text-white">
              Um Serviço Que Atende Às Suas Necessidades
            </h1>
            <h1 className="text-center mt-10 text-2xl text-white">
              Somos a Solução
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mt-20 pb-10">
              <Button
                className="py-3 text-white cursor-pointer px-8 sm:px-20 mb-2 rounded-full bg-transparent border border-white hover:bg-white hover:text-[#295ed7] transition-colors"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                >
                <Link href='/modulos/gestão-de-dados' >Nossos Serviços</Link>
              </Button>

              <Button
                className="py-3 cursor-pointer px-8 sm:px-20 mb-2 rounded-full bg-white text-[#295ed7] hover:bg-gray-100 transition-colors"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                >
                <Link href='/registrar' >Começar agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section2