import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'


function JobsPage({searchParams} : {searchParams: {message: string}}) {

  return (
    <div>
        <h1>{searchParams.message} Jobs</h1>
    </div>
  )
}



export default JobsPage
