import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExerciseFormCard() {
  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden mt-2">
      <CardHeader className="bg-primary-dark text-white p-3">
        <CardTitle className="font-heading font-medium">Goblet Squat Form Guide</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Using an SVG or illustration instead of an image */}
        <div className="rounded w-full h-40 mb-4 bg-neutral-100 flex items-center justify-center">
          {/* SVG placeholder for exercise demonstration */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-32 w-32 text-primary"
            fill="currentColor"
          >
            <path d="M207.9 512h-160c-20.7 0-37.5-16.8-37.5-37.5v-112.5c0-8.5 3.4-16.6 9.4-22.6l26.8-26.8c11.3-11.3 30.3-11.3 41.6 0 6.6 6.6 9.4 15.6 8.4 24.4 3.1-.5 6.4-.8 9.7-.8 32.3 0 58.5 26.3 58.5 58.5 0 3.3-.3 6.6-.8 9.7 8.8-1.1 17.8 1.8 24.4 8.4 11.3 11.3 11.3 30.3 0 41.6l-26.8 26.8c-6 6-14.1 9.4-22.6 9.4h-112.5c-20.7 0-37.5-16.8-37.5-37.5v-112.5c0-8.5 3.4-16.6 9.4-22.6l26.8-26.8c11.3-11.3 30.3-11.3 41.6 0 6.6 6.6 9.4 15.6 8.4 24.4 3.1-.5 6.4-.8 9.7-.8 32.3 0 58.5 26.3 58.5 58.5 0 3.3-.3 6.6-.8 9.7 8.8-1.1 17.8 1.8 24.4 8.4 11.3 11.3 11.3 30.3 0 41.6l-26.8 26.8c-6 6-14.1 9.4-22.6 9.4h-112.5c-20.7 0-37.5-16.8-37.5-37.5v-112.5c0-8.5 3.4-16.6 9.4-22.6l26.8-26.8c11.3-11.3 30.3-11.3 41.6 0 6.6 6.6 9.4 15.6 8.4 24.4 3.1-.5 6.4-.8 9.7-.8 32.3 0 58.5 26.3 58.5 58.5 0 3.3-.3 6.6-.8 9.7 8.8-1.1 17.8 1.8 24.4 8.4 11.3 11.3 11.3 30.3 0 41.6l-26.8 26.8c-6 6-14.1 9.4-22.6 9.4zm-37.5-150c-12.4 0-22.5 10.1-22.5 22.5s10.1 22.5 22.5 22.5 22.5-10.1 22.5-22.5-10.1-22.5-22.5-22.5zm-65 65c-12.4 0-22.5 10.1-22.5 22.5s10.1 22.5 22.5 22.5 22.5-10.1 22.5-22.5-10.1-22.5-22.5-22.5zm130-130c-12.4 0-22.5 10.1-22.5 22.5s10.1 22.5 22.5 22.5 22.5-10.1 22.5-22.5-10.1-22.5-22.5-22.5zm-65 65c-12.4 0-22.5 10.1-22.5 22.5s10.1 22.5 22.5 22.5 22.5-10.1 22.5-22.5-10.1-22.5-22.5-22.5z"/>
          </svg>
        </div>
        
        <h4 className="font-medium mb-2">Steps:</h4>
        <ol className="list-decimal pl-5 space-y-2 mb-4">
          <li>Hold a kettlebell or dumbbell close to your chest with both hands, elbows pointing down.</li>
          <li>Stand with feet slightly wider than shoulder-width apart, toes pointed slightly outward.</li>
          <li>Keeping your chest up and core engaged, push your hips back and bend your knees to lower into a squat.</li>
          <li>Lower until thighs are parallel to the ground (or as low as is comfortable with good form).</li>
          <li>Push through your heels to return to the starting position.</li>
        </ol>
        
        <h4 className="font-medium mb-2">Key Form Points:</h4>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 text-sm mt-0.5">check_circle</span>
            <span>Keep weight in mid-foot and heels (not toes)</span>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 text-sm mt-0.5">check_circle</span>
            <span>Maintain a neutral spine throughout the movement</span>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 text-sm mt-0.5">check_circle</span>
            <span>Knees should track over toes, not caving inward</span>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2 text-sm mt-0.5">check_circle</span>
            <span>Brace your core throughout the exercise</span>
          </li>
        </ul>
        
        <Button 
          className="bg-accent text-white py-2 px-4 rounded flex items-center justify-center w-full"
        >
          <span className="material-icons mr-2">play_circle</span>
          Watch Video Demo
        </Button>
      </CardContent>
    </Card>
  );
}
