"use client";

import { cn } from "@/app/utils/general/cn";
import { SquareArrowRight } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

type NextArrowProps = {
  newStage: number;
  setStage: Dispatch<SetStateAction<number>>;
};

function NextArrow({ newStage, setStage }: NextArrowProps) {
  return (
    <button
      onClick={() => setStage(newStage)}
      className="absolute bottom-2 right-2"
    >
      <SquareArrowRight />
    </button>
  );
}

export default function DemoPage() {
  const [stage, setStage] = useState(1);
  return (
    <>
      <header>
        <h1 className="flex text-3xl font-bold">Demo</h1>
      </header>

      <section className="flex flex-col flex-grow md:grid md:grid-cols-2 gap-2 md:gap-4 md:mt-4">
        <div
          className={cn(
            "flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-1 md:row-start-1",
            {
              // "max-h-[47.5%]": stage === 1 || stage === 2,
            }
          )}
        >
          <h2 className="font-semibold mb-1 text-lg md:text-xl">
            Welcome to your Local Video Player!
          </h2>
          <p className="md:text-lg">
            This app lets you play home videos from your local system (
            <span className="italic">Mac, PC, iPad</span>) and - if you are
            signed in - will store your progress so you can return to them
            later!
          </p>
          <p className="md:text-lg mt-0.5">
            <span className="font-bold">Firstly</span>, head to the Home page
            and you'll be greeted with a big blue button. When you click on
            that, you'll be presented with a Finder-like file picker, like the
            below:
          </p>
          <div className="self-center">
            <Image
              src="/images/demo-01-file-picker-eg.png"
              alt="File picker on Desktop Safari"
              width={400}
              height={200}
            />
          </div>
          <NextArrow newStage={2} setStage={setStage} />
        </div>

        {stage >= 2 ? (
          <div
            className={cn(
              "flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-2 md:row-start-1 transition-all duration-150 ease-in-out",
              {
                // "max-h-[47.5%]": stage === 1 || stage === 2,
              }
            )}
          >
            <h2 className="font-semibold mb-1 text-lg md:text-xl">
              Time to Process...
            </h2>
            <p className="md:text-lg">
              Once you've selected a folder, or some files, the app will process
              them and, if you are signed in, will save their information or, if
              they have already been processed, retrieve the golden piece of
              data, their <span className="italic">progress</span>. Once the
              processing is complete, you will be greeted with a list of
              thumbnails and video titles like below
            </p>
            <div className="self-center">
              <Image
                src="/images/demo-02-file-list.png"
                alt="File picker on Desktop Safari"
                width={500}
                height={300}
              />
            </div>
            <NextArrow newStage={3} setStage={setStage} />
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-2 md:row-start-1 opacity-0 translate-y-4",
              {
                // "max-h-[47.5%]": stage === 1 || stage === 2,
              }
            )}
          >
            <h2 className="font-semibold mb-1 text-lg md:text-xl">
              Time to Process...
            </h2>
            <p className="md:text-lg">
              Once you've selected a folder, or some files, the app will process
              them and, if you are signed in, will save their information or, if
              they have already been processed, retrieve the golden piece of
              data, their <span className="italic">progress</span>. Once the
              processing is complete, you will be greeted with a list of
              thumbnails and video titles like below
            </p>
            <div className="self-center">
              <Image
                src="/images/demo-02-file-list.png"
                alt="File picker on Desktop Safari"
                width={500}
                height={300}
              />
            </div>
            <NextArrow newStage={3} setStage={setStage} />
          </div>
        )}

        {stage >= 3 ? (
          <div className="flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-1 md:row-start-2 transition-all duration-150 ease-in-out">
            <h2 className="font-semibold mb-1 text-lg md:text-xl">
              Now, watch!
            </h2>
            <p className="md:text-lg">
              <span className="italic">Click</span> on a video you want to watch
              and you'll be navigated through to a player. Every 5 seconds, your
              progress is saved, and will be ready for when you return.
            </p>
            <div className="self-center">
              <Image
                src="/images/demo-03-video-player.png"
                alt="File picker on Desktop Safari"
                width={500}
                height={300}
              />
            </div>
            <NextArrow newStage={4} setStage={setStage} />
          </div>
        ) : (
          <div className="flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-1 md:row-start-2 opacity-0 translate-y-4">
            <h2 className="font-semibold mb-1 text-lg md:text-xl">
              Now, watch!
            </h2>
            <p className="md:text-lg">
              <span className="italic">Click</span> on a video you want to watch
              and you'll be navigated through to a player. Every 5 seconds, your
              progress is saved, and will be ready for when you return.
            </p>
            <div className="self-center">
              <Image
                src="/images/demo-03-video-player.png"
                alt="File picker on Desktop Safari"
                width={500}
                height={300}
              />
            </div>
            <NextArrow newStage={4} setStage={setStage} />
          </div>
        )}

        {stage === 4 ? (
          <div className="flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-2 md:row-start-2  transition-all duration-150 ease-in-out">
            <h2 className="font-semibold mb-1 text-lg md:text-xl">
              Something to Note
            </h2>
            <p className="md:text-lg">
              If you refresh the browser after you've processed some files, you
              will need to process them again.
            </p>
            <p className="md:text-lg mt-1">
              This is due to how the url that is created to watch the file works
              (and that is because I am cheaping out on not paying for server
              space to host videos)
            </p>
            <p className="md:text-lg mt-1">
              If you don't have any files to hand.{" "}
              <span className="italic text-blue-500 hover:underline hover:cursor-pointer">
                Download this one
              </span>{" "}
              and try it out on the Home page
            </p>
          </div>
        ) : (
          <div className="flex flex-col relative border-orange-400 border-2 rounded-lg p-2 md:col-start-2 md:row-start-2 opacity-0 translate-y-4">
            <h2 className="font-semibold mb-1 text-lg md:text-xl">
              Something to Note
            </h2>
            <p className="md:text-lg">
              If you refresh the browser after you've processed some files, you
              will need to process them again.
            </p>
            <p className="md:text-lg mt-1">
              This is due to how the url that is created to watch the file works
              (and that is because I am cheaping out on not paying for server
              space to host videos)
            </p>
            <p className="md:text-lg mt-1">
              If you don't have any files to hand.{" "}
              <span className="italic text-blue-500 hover:underline hover:cursor-pointer">
                Download this one
              </span>{" "}
              and try it out on the Home page
            </p>
          </div>
        )}
      </section>
      {/* Header 

        Skip Button
      Griiiiiiiiiiiiiiiiiiiid
        Section     Section
          
        Section     Section
      Griiiiiiiiiiiiiiiiiiiid

      Grid = {
        Sections appear in a 2x2 grid on desktop.
        Sections appear in a column on mobile.  
        }

      Section = {
        Bit of text. Screenshot. <Image />
        Arrow for next section (state to hold progress on page)
        }
          */}

      {/* What are the sections?
        
          Hello and welcome to the local video player! 
          This app lets you play home videos from your local system (Mac, PC, iPad)
          and, if signed in, will store your progress so you can return to them later!  
          
          Firstly, head to the Home page and you'll be greeted with a big blue button.
          When you click on that, you'll be presented with a Finder-like file picker, like the below:
          <Image />

          
          Once you've selected a folder, or some files, the app will process them and, again,
          if you are signed in, will save their information to the database or, if they have already been
          processed, retrieve the golden piece of data, your <span className="italic">progress</span>
          Once the processing is complete, you will be greeted with a list like the below
          <Image />
          
          
          Now, all you need to do is watch! <span className="italic">Click</span> on a video you want
          to watch and you'll be navigated through to a player. Every 5 seconds, your progress is saved
          to the database, and

        */}
    </>
  );
}
