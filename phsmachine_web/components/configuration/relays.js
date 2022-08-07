import { useState, useEffect } from 'react'
import Loading from "../loading"

const Relays = ({ relays, coreRelays, onSave}) => {
  const [fRelays, setFRelays] = useState([])
  const [newRel, setNewRel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFRelays(relays);
    setLoading(false)
  }, [relays]);

  return (
    <div >
        {
            loading && <Loading />
        }
        <p className='mt-4 text-sm'>Actions activates on different kind of events. You can define different actions that will use devices that can be toggled by relays to on or off state</p>
    </div>
  )
}

export default Relays