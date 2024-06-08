import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from "lucide-react"
import { generateAudioAction } from '../convex/openai';
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useToast } from '@/components/ui/use-toast'

// Custom Hook
const useGeneratePodcast = ({
    setAudio,
    voiceType,
    voicePrompt,
    setAudioStorageId
}: GeneratePodcastProps) => {

    // Logic for podcast Generation
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl)
    const getPodcastAudio = useAction(api.openai.generateAudioAction);
    const getAudioUrl = useMutation(api.podcasts.getUrl);

    const generatePodcast = async () => {
        setIsGenerating(true);
        setAudio('');

        if (!voicePrompt) {
            // todo add toast 
            toast({
                title: 'No VoicePrompt Available'
            })
            return setIsGenerating(false)
        }

        try {
            const response = await getPodcastAudio({
                voice: voiceType,
                input: voicePrompt,
            })

            const blob = new Blob([response], { type: 'audio/mpeg' });
            const fileName = `podcast-${uuidv4()}.mp3`
            const file = new File([blob], fileName, { type: 'audio/mpeg' });
            const uploaded = await startUpload([file])
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);
            const audioUrl = await getAudioUrl({ storageId })
            setAudio(audioUrl!);
            setIsGenerating(false);
            //todo toast
            toast({
                title: 'Toast',
            })

        } catch (e) {
            console.log('error in Generate Podcast/ useGeneratePodcast', e)
            // todo add toast
            toast({
                title: 'Podcast not generated',
                // variant: 'destructive',
            })
            setIsGenerating(false);
        }

    }


    return {
        isGenerating, generatePodcast
    }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {

    // const [isGenerating, setIsGenerating] = useState(false)
    const { isGenerating, generatePodcast } = useGeneratePodcast(props);

    return (
        <div>
            {/* <p className='rext-white-1'>{isGenerating}</p> */}
            <div className='flex flex-col gap-2.5'>
                <Label className="text-16 font-bold text-white-1">
                    Ai Prompt to generate podcast
                </Label>
                <Textarea
                    className="input-class font-light focus-visible:ring-offset-orange-1"
                    placeholder='Enter text to generate audio'
                    rows={4}
                    value={props.voicePrompt}
                    onChange={(e) => props.setVoicePrompt(e.target.value)}
                />
                // !{/* <p className='text-white-1'>{voicePrompt}</p> */}
            </div>
            <div className='mt-5 w-full max-w-[200px]'>
                <Button type="submit" onClick={generatePodcast} className="text-16  bg-orange-400 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-5">
                    {isGenerating ? (
                        <>
                            Generating
                            <Loader size={20} className='animate-spin ml-2' />
                        </>
                    ) : (
                        'Generate'
                    )}
                </Button>
            </div>
            {props.audio && (
                <audio
                    controls
                    src={props.audio} // url of audio
                    autoPlay
                    className="mt-5"
                    onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
                />
            )}
        </div>
    )
}

export default GeneratePodcast
