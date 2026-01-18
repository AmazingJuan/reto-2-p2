interface Options {
    label : string; 
    next_condition? : number;
}


interface ConditionData {
    label : string; 
    interaction_type : string;
    type : string; 
    observation : string; 
    allows_multiple_values : string; 
    options? : Options[];
}




export default function Condition() {
    return (
       <div>
       </div>
    );
}
