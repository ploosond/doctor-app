import { ServiceForm } from "../components/ServiceForm"
import { createService } from "../actions"

export default function NewServicePage() {
  return (
    <div className="admin-page" style={{ maxWidth: 800 }}>
      <h1 className="admin-h1">New service</h1>
      <ServiceForm action={createService} />
    </div>
  )
}
