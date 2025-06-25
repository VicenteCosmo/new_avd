'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import CardContents from '../../components/CardsContents'

import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react'
import Link from 'next/link'

const ModuleCard = ({ 
  title, 
  description,
  imageSrc, link
} : {title: any, description: any, imageSrc: any, link: any}) => (
  <Card className="mt-10 w-11/12 h-full  shadow-2xl rounded-2xl"
    placeholder={undefined} 
    onPointerEnterCapture={undefined} 
    onPointerLeaveCapture={undefined}>

    <CardBody
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <div className='flex flex-row' >
        <div className=' ' >
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
                    className="mb-2 px-5 text-black mt-5 whitespace-pre-line"
                    placeholder={undefined}>
                    {description}
                </Typography>
        </div>
        <div>
            <Image 
                src={imageSrc} 
                alt={title} 
                width={320} 
                height={224} 
                className="w-80 h-50 mx-auto object-contain "
            />
        </div>

      </div>
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
            {''} 
      </Button>
    </CardFooter>
  </Card>
)

const ModuleName = ({}) => {

    const params = useParams<{modulename: string}>() 
    const moduleNameEnconded = params.modulename
    const moduleName = decodeURIComponent(moduleNameEnconded)


 
    console.log(params)

  return (
    <>
      {
            moduleName === 'gestão-de-dados' ? (
                <div>
                    
                    <ModuleCard
                    title={CardContents[0].title}
                    description={CardContents[0].fullInfo}
                    imageSrc={CardContents[0].imageSrc}
                    link={`/modulos/${CardContents[0].title.toLowerCase().replace(/\s+/g, '-')}`}
          />

                </div>
            ) : moduleName === 'gestão-de-formações' ? (
                <div>
                    <ModuleCard
                    title={CardContents[1].title}
                    description={CardContents[1].fullInfo}
                    imageSrc={CardContents[1].imageSrc}
                    link={`/modulos/${CardContents[1].title.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                </div>
            ): moduleName === 'gestão-de-tempo' ?(
                <div>
                    <ModuleCard
                    title={CardContents[2].title}
                    description={CardContents[2].fullInfo}
                    imageSrc={CardContents[2].imageSrc}
                    link={`/modulos/${CardContents[2].title.toLowerCase().replace(/\s+/g, '-')}`}
                />
                </div>
            ): (
                <div>
                    <p>Módulo desconhencido</p>
                </div>
            )
            
            }
      
    </>
  )
}

export default ModuleName
