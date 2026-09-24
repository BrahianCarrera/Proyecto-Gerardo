import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientCard from '../../components/PatientCard'
import Spinner from '../../components/Spinner'
import { getPatients } from '../../data/mockApi'
import type { Patient } from '../../types'

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const fetchPatients = useCallback(async () => {
    try {
      setPatients(await getPatients())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) return <Spinner text="Cargando pacientes..." />

  return (
    <div className="px-6 pb-6 pt-6">
      <input
        className="mb-4 w-full rounded-md border border-gray-300 bg-white p-2.5 text-base outline-none focus:border-primary"
        placeholder="Buscar por nombre o cédula..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.length === 0 && (
        <p className="py-8 text-center text-gray-500">
          No se encontraron pacientes.
        </p>
      )}

      {filtered.map((patient) => (
        <PatientCard
          key={patient.id}
          name={patient.name}
          subtext={patient.medicalHistory}
          detail={`${patient.age} años`}
          onPress={() => navigate(`/admin/patients/${patient.id}`)}
        />
      ))}
    </div>
  )
}
