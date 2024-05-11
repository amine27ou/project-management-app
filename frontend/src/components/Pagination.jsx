

export default function Pagination({ handleNext,handlePrevious,info }) {

  return (
    <nav className="text-center mt-4 flex gap-10 justify-center">
        {info && info.prev_page_url ? (
                <button className="bg-slate-700 p-2 rounded-sm text-blue-500" onClick={handlePrevious}>
                  Previous
                </button>
            ) : null}
            {info && info.next_page_url ? (
                <button className="bg-slate-700 p-2 rounded-sm text-blue-500" onClick={handleNext}>
                  Next
                </button>
            ) : null}
      
    </nav>
  );
}