import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Interest {
  id: string;
  label: string;
}

interface InterestsFormProps {
  interests: Interest[];
  selectedInterests: string[];
  onInterestChange: (interest: string) => void;
}

const InterestsForm = ({ interests, selectedInterests, onInterestChange }: InterestsFormProps) => {
  return (
    <div className="space-y-2">
      <Label>What are you interested in?</Label>
      <div className="flex space-x-6">
        {interests.map((interest) => (
          <div key={interest.id} className="flex items-center space-x-2">
            <Checkbox
              id={interest.id}
              checked={selectedInterests.includes(interest.id)}
              onCheckedChange={() => onInterestChange(interest.id)}
            />
            <Label htmlFor={interest.id}>{interest.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestsForm;