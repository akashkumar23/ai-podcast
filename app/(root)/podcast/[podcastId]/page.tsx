import React from 'react'

const PodcastDetails = ({params} : {params : {podcastId: string}}) => {
  return (
    <div>
      {params.podcastId}
    </div>
  )
}

export default PodcastDetails
