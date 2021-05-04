
import prisma from '../../../prisma/prisma'

export default async function handle(req, res) {
     const sliderId = req.body.id;
    // TODO:
    //   const sliderId = 1;
    
    const sliderVal = req.body.values[0];
    const slider = await prisma.slider.update({
      where: { SLIDER_ID: Number(sliderId) },
      data: { SLIDER_VALUE: sliderVal },
    });
    res.status(200).json({id: sliderId, value: sliderVal});
  }