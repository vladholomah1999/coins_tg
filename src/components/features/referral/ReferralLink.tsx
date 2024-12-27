'use client'

interface ReferralLinkProps {
  code: string
}

export const ReferralLink = (props: ReferralLinkProps) => (
  <div className="p-4 bg-white rounded-lg shadow">
    <h3 className="font-semibold mb-2">Реферальне посилання</h3>
    <input
      readOnly
      value={`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=${props.code}`}
      className="w-full p-2 bg-gray-50 rounded border"
    />
  </div>
)