'use client'

interface Task {
  id: string
  title: string
}

interface Props {
  tasks: Task[]
  isOpen: boolean
  onClose: () => void
}

export const TaskModal = (props: Props) => {
  if (!props.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {props.tasks.map(task => (
          <div key={task.id} className="p-4 bg-gray-50 rounded mb-2">
            {task.title}
          </div>
        ))}
        <button
          onClick={props.onClose}
          className="w-full py-3 bg-blue-500 text-white rounded-lg"
        >
          Закрити
        </button>
      </div>
    </div>
  )
}