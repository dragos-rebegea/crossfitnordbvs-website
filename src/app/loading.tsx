export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-grayText">Se incarca...</p>
      </div>
    </div>
  );
}
