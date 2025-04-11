export default function getEventStatus(status) {
    if(status === 'ongoing'){
      return 'Live';
    }

    if(status === 'past'){
      return 'Closed';
    }    

    if(status === 'future'){
      return 'Upcoming';
    }
  }