
const ANGLE_OFFSET_DEFAULT = 270;
const X_POINT_DEFAULT = 100;
const Y_POINT_DEFAULT = 100;
const SMALL_RADIUS_DEFAULT = 50;
const BIG_RADIUS_DEFAULT = 80;
const UNCHECKED_FILL_COLOR = '#493f33';
const CHECKED_FILL_COLOR = '#761a0d';
const BORDER_COLOR = '#9e8b52';



export default function Clock({segmentsNumber, completedSegments, id}: props) {
  const clockID = `clock-canvas-${id}`;
  drawClocks(clockID, segmentsNumber, completedSegments);
  return (
    <canvas id = {clockID} width="300" height="300"></canvas>
  )

}

type props = {
    segmentsNumber: number,
    completedSegments: number,
    id: string
}

function drawClocks(id: string, segments: number, checked: number, xpoint = X_POINT_DEFAULT, ypoint = Y_POINT_DEFAULT, smallRadius = SMALL_RADIUS_DEFAULT, bigRadius = BIG_RADIUS_DEFAULT, angleOffset = ANGLE_OFFSET_DEFAULT){
    if (segments < 3 || segments > 12 || checked > segments) return;
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx = ctxRaw;
    const rotateAngle = 360 / segments;
    const arcAngle = rotateAngle - 10;
    const rotateRadians = degreeToRadians(rotateAngle);
    const startAngleRadians = degreeToRadians(angleOffset+arcAngle/2);
    const endAngleRadians = degreeToRadians(angleOffset-arcAngle/2);
    const startAngleRadiansOffset = degreeToRadians(angleOffset-arcAngle/2 - 1);
    const endAngleRadiansOffset = degreeToRadians(angleOffset+arcAngle/2 + 1);
    let currentColor: string;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < segments; index++){
        currentColor =  (index + 1 <= checked)? CHECKED_FILL_COLOR : UNCHECKED_FILL_COLOR;
        drawPartOfRing(currentColor);
        ctx.translate(xpoint, ypoint);
        ctx.rotate(rotateRadians);
        ctx.translate(-xpoint, -ypoint);
    }


    function strokeArc(radius: number){
        ctx.beginPath();
        ctx.arc(xpoint, ypoint, radius, startAngleRadians, endAngleRadians, true);
        // console.log(xpoint, ypoint, radius, startAngleRadians, endAngleRadians)
        ctx.stroke();
    }

    function fillArc(color: string ){
        ctx.strokeStyle = color;
        let radius = smallRadius;
        ctx.lineWidth = 5;
        while (radius < bigRadius){
            strokeArc(radius);
            radius = radius + 2;
        }
    }

    function partOfRingBorder(){
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xpoint, ypoint, smallRadius, startAngleRadians, endAngleRadians, true);
        ctx.arc(xpoint, ypoint, bigRadius, startAngleRadiansOffset, endAngleRadiansOffset);
        ctx.arc(xpoint, ypoint, smallRadius, startAngleRadians, endAngleRadians, true);
        ctx.stroke();
    }

    function drawPartOfRing(color: string){
        ctx.beginPath();
        fillArc(color);
        partOfRingBorder();
    }
}

function degreeToRadians(degree: number){
    return degree * Math.PI / 180;
}