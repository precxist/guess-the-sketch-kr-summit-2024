from vertexai.preview.vision_models import ImageGenerationModel
import vertexai

PROJECT_ID = "minjkang-default"  # @param {type:"string"}
LOCATION = "asia-northeast3"  # @param {type:"string"}
vertexai.init(project=PROJECT_ID, location=LOCATION)

imagen = ImageGenerationModel.from_pretrained("imagegeneration@006")
response = imagen.generate_images(
    prompt='리트리버',
    number_of_images=1,
    language='ko',
    safety_filter_level="block_few",
)


image = response.images[0]._pil_image
# print(type(image))
image = image.resize((900, 900))
image.save('result.png')