export default function ModalWrapper({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[360px] mx-auto bg-slate-900 rounded-xl p-4 overflow-y-auto max-h-[80vh]"
      >
        {children}
      </div>
    </div>
  )
}
