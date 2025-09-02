import { MessageCenter } from "@/components/communication/message-center"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Message Center</h1>
        <p className="text-muted-foreground">Communicate with teachers, parents, and students</p>
      </div>
      <MessageCenter />
    </div>
  )
}
