import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader } from 'lucide-react';
import { GenerateThumbnailProps } from '@/types';
import Image from 'next/image';
import { useToast } from './ui/use-toast';
import { useAction, useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid'

const GenerateThumbnail = ({
  setImage, setImageStorageId, image, imagePrompt, setImagePrompt
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setisImageLoading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const {toast} = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl)
    const getImageUrl = useMutation(api.podcasts.getUrl);
    const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction)

  const handleImage = async(blob: Blob, fileName: string) => {
    setisImageLoading(true);
    setImage('');
    try{
            
            const file = new File([blob], fileName, { type: 'image/png' });
            const uploaded = await startUpload([file])
            const storageId = (uploaded[0].response as any).storageId;

            setImageStorageId(storageId);
            const imageUrl = await getImageUrl({ storageId })
            setImage(imageUrl!);
            setisImageLoading(false);
            toast({
              title: 'Thumbnail Image  Generated Successfully'
            })
    }catch(e){
      console.log(e);
      console.log('Handleimage/generateThumbnail')
      toast({
        title: 'Error generating thumbnail'
      })
    }
  }

  //! this function is for openapi prompt thumbnail generation
  const generateImage = async () => {

    try{
      const response = await handleGenerateThumbnail({prompt: imagePrompt});
    const blob = new Blob([response], {type: 'image/png'});
    handleImage(blob, `thumbnail-${uuidv4()}`);
    }catch(e){
      console.log(e)
      console.log('Handleimage/generateImage');
      toast({
        title: 'Error generating ai-thumbnail'
      })
    }

    
  }

  //! BELOW function is for custom thumbnail upload
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if(!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer()
      .then((ab) =>new Blob([ab]));
      handleImage(blob, file.name);
    }catch(e){
      console.log(e)
      console.log('Handleimage/generateThumbnail')
      toast({
        title: 'Error generating thumbnail'
      })
    }

  }

  return (
    
      <>
      <div className='generate_thumbnail'>
        <Button
          type='button'
          variant='plain'
          onClick={()=>setIsAiThumbnail(true)}
          className={cn('', {
            'bg-black-6': isAiThumbnail
          })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type='button'
          variant='plain'
          onClick={()=>setIsAiThumbnail(false)}
          className={cn('', {
            'bg-black-6': !isAiThumbnail
          })}
        >
          Upload Custom Image
        </Button>

      </div>
      {isAiThumbnail ? (
        <div className='flex flex-col'>
          <div className='mt-5 flex flex-col gap-2.5'>
                <Label className="text-16 font-bold text-white-1">
                    AI Prompt to generate Thumbnail
                </Label>
                <Textarea
                    className="input-class font-light focus-visible:ring-offset-orange-1"
                    placeholder='Enter text to generate thumbnail'
                    rows={4}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                />
                // !{/* <p className='text-white-1'>{voicePrompt}</p> */}
            </div>
            <div className='mt-5 w-full max-w-[200px]'>
                <Button type="submit" onClick={generateImage} className="text-16  bg-indigo-400 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-5">
                    {isImageLoading ? (
                        <>
                            Loading Image 
                            <Loader size={20} className='animate-spin ml-2' />
                        </>
                    ) : (
                        'Generate Image'
                    )}
                </Button>
            </div>
        </div>
      ):(
        <div className='image_div' onClick={()=>imgRef?.current?.click()}>
          <input 
            type='file'
            className='hidden'
            ref={imgRef}
            onChange={(e)=>uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={50}
              height={50}
              alt='upload-image'
            />
          ):(
            <div className='text-16 flex-center font-medium text-white-1'>
              Uploading
              <Loader size={20} className='animate-spin ml-2' />
            </div>
          )}
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-white-1'>Click to upload</h2>
            <p className='text-white-5 text-normal'>SVG, PNG, JPG</p>
          </div>

        </div>
      )}
      {image && (
        <div className='flex-center w-full'>
          <Image
            src={image}
            width={
              200
            }
            height={200}
            alt='thumbnail'
            className='mt-5'
          />
        </div>
      )}
      </>
    
  )
}

export default GenerateThumbnail
