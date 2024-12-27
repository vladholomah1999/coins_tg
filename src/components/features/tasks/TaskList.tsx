interface Task {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  link?: string;
}

export const TaskList = () => {
  const tasks: Task[] = [
    {
      id: 'telegram',
      title: 'Підписатися на Telegram канал',
      reward: 500,
      completed: false,
      link: 'https://t.me/your_channel'
    },
    {
      id: 'instagram',
      title: 'Підписатися на Instagram',
      reward: 500,
      completed: false,
      link: 'https://instagram.com/your_profile'
    }
  ]

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Завдання</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-green-500">+{task.reward} NOT</p>
            </div>
            {task.link ? (
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Перейти
              </a>
            ) : (
              <button
                className={`px-4 py-2 rounded ${
                  task.completed 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                disabled={task.completed}
              >
                {task.completed ? 'Виконано' : 'Виконати'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}