'use client'
import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react'

const ModuleCard = ({ 
  title = "Gestão de Dados", 
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non vel nesciunt aperiam, harum aut ab porro voluptatum hic obcaecati quo quia iste distinctio enim voluptatibus atque minima repellendus odit modi!",
  imageSrc = "/peer-to-peer1.png"
}) => (
  <Card className="mt-10 w-96 h-120 shadow-2xl rounded-2xl"
    placeholder={undefined} 
    onPointerEnterCapture={undefined} 
    onPointerLeaveCapture={undefined}>
    
    <CardHeader className="relative h-56 rounded-2xl flex"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <Image 
        src={imageSrc} 
        alt={title} 
        width={320} 
        height={224} 
        className="w-80 h-50 mx-auto object-contain "
      />
    </CardHeader>

    <CardBody
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <Typography
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
        variant="h4" 
        className="mb-2 text-black px-5"
        placeholder={undefined}>
        {title}
      </Typography>

      <Typography
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
        className="mb-2 px-5 text-black mt-5"
        placeholder={undefined}>
        {description}
      </Typography>
    </CardBody>

    <CardFooter className="pt-0 px-5 mt-3"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <Button
        className="bg-black py-3 px-7 mb-2 rounded-2xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        >
            
        Saiba mais
      </Button>
    </CardFooter>
  </Card>
)

const sliderImages = [
  "/hr.png",
  "/peer-to-peer1.png",
  ...Array(7).fill("/peer-to-peer1.png") // Repeats the same image 7 times
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
      <h1 className="text-center text-white text-4xl font-bold py-10 bg-gradient-to-r from-[#3ffc2f] to-[#2f83c3] bg-clip-text text-transparent ">
        Módulos RH que atendem às suas necessidades
      </h1>

      {/* Slider Section */}
      <div className="mx-auto bg-blue-200 py-10">
        <div className="container mx-auto px-4">
          <Slider {...sliderSettings}>
            {sliderImages.map((src, index) => (
              <div key={index} className="px-2">
                <div className="flex justify-center">
                  <Image 
                    src={src} 
                    alt={`Slide ${index + 1}`} 
                    width={200} 
                    height={100}
                    className="object-contain"
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
          <ModuleCard />
          <ModuleCard />
          <ModuleCard />
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
                Nossos Serviços
              </Button>

              <Button
                className="py-3 cursor-pointer px-8 sm:px-20 mb-2 rounded-full bg-white text-[#295ed7] hover:bg-gray-100 transition-colors"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                >
                Começar agora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section2