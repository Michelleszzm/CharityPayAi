"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import { Check } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import ChooseTemplate from "./components/ChooseTemplate"
import StyleSettings from "./components/StyleSettings"
import DonationForm from "./components/DonationForm"
import LinkSettings from "./components/LinkSettings"
export default function Fundraising() {
  const stepList = [
    {
      step: 1,
      title: "Choose Template"
    },
    {
      step: 2,
      title: "Style Settings"
    },
    {
      step: 3,
      title: "Donation Form"
    },
    {
      step: 4,
      title: "Link Settings"
    }
  ]
  // current step
  const [currentStep, setCurrentStep] = useState(1)

  const [currentTemplate, setCurrentTemplate] = useState(null)

  // track the previous step, used to determine the animation direction, here must use useRef, because using useState will cause the component to be re-rendered, causing the animation to fail, using a normal variable, each time the component is re-rendered, the variable will be reset
  const prevStepRef = useRef(1)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

  useEffect(() => {
    // determine whether to move forward or backward
    if (currentStep > prevStepRef.current) {
      setDirection("forward")
    } else if (currentStep < prevStepRef.current) {
      setDirection("backward")
    }
    // update the previous step
    prevStepRef.current = currentStep

    // if the current step is 1, set the current template to null
    if (currentStep === 1) {
      setCurrentTemplate(null)
    }
  }, [currentStep])

  // define the variants for the step switch animation
  const pageVariants = {
    enter: {
      x: direction === "forward" ? 50 : -50,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: direction === "forward" ? -30 : 30,
      opacity: 0
    }
  }

  // animation transition configuration
  const pageTransition = {
    enter: {
      duration: 0.4,
      ease: "easeInOut"
    },
    exit: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-[250px] w-full bg-[#FFF1C5]">
        <Image
          src={bgImage}
          alt="bg"
          width={3072}
          height={500}
          className="h-full w-auto"
        />
      </div>
      <div className="relative z-2">
        <div className="flex justify-center pt-12">
          <div className="w-[1280px]">
            <div className="text-[32px] leading-[39px] font-bold text-[#000]">
              Fundraising pages
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              Set up your personalized donation page with your preferred design.
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="flex justify-center">
          <div
            className="mt-12 w-[1280px] rounded-2xl bg-white py-12"
            style={{
              border: "1px solid #E9E9E9",
              boxShadow: "0px 0px 16px 0px rgba(84,93,105,0.1)"
            }}
          >
            {/* step bar */}
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                {stepList.map((item, index) => (
                  <div key={item.step} className="flex">
                    <div
                      className={cn(
                        "flex flex-col items-center",
                        currentStep > item.step && "cursor-pointer"
                      )}
                      onClick={() => {
                        if (currentStep > item.step) {
                          setCurrentStep(item.step)
                        }
                      }}
                    >
                      {(() => {
                        if (currentStep === item.step) {
                          return (
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#FE5827] text-[18px] font-bold text-white">
                              {item.step}
                            </div>
                          )
                        } else if (currentStep < item.step) {
                          return (
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#E9E9E9] text-[18px] font-bold text-[#020328]">
                              {item.step}
                            </div>
                          )
                        } else {
                          return (
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#020328]">
                              <Check className="size-5 text-white" />
                            </div>
                          )
                        }
                      })()}
                      <div className="mt-2 text-[14px] leading-[18px] text-[#020328]">
                        {item.title}
                      </div>
                    </div>
                    {index !== stepList.length - 1 && (
                      <div className="mt-5 h-[1px] w-[220px] bg-[#E9E9E9]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="w-full"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
              >
                {(() => {
                  if (currentStep === 1) {
                    return (
                      <ChooseTemplate
                        setCurrentTemplate={setCurrentTemplate}
                        setCurrentStep={setCurrentStep}
                      />
                    )
                  } else if (currentStep === 2) {
                    return (
                      <StyleSettings
                        currentTemplate={currentTemplate}
                        setCurrentStep={setCurrentStep}
                      />
                    )
                  } else if (currentStep === 3) {
                    return <DonationForm setCurrentStep={setCurrentStep} />
                  } else if (currentStep === 4) {
                    return <LinkSettings setCurrentStep={setCurrentStep} />
                  }
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
