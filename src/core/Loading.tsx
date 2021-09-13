import React from 'react'
import "./loading.css"

type LoadingProps = {
  loading: boolean
}

const Loading: React.FC<LoadingProps> = ({
  loading=false,
  children
}) => {
  return loading ? <div className="loading"></div> : <>{children}</>;
}

export default Loading;
