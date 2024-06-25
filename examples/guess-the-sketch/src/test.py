from vertexai.preview.vision_models import ImageGenerationModel
import vertexai

PROJECT_ID = "minjkang-default"  # @param {type:"string"}
LOCATION = "asia-northeast3"  # @param {type:"string"}
vertexai.init(project=PROJECT_ID, location=LOCATION)

imagen = ImageGenerationModel.from_pretrained("imagegeneration@006")
response = imagen.generate_images(
    prompt='golden retriever',
    number_of_images=1,
    language='ko',
    safety_filter_level="block_some",
)
    
# print(response)
# print(type(response.images[0]))

response.images[0].save('result.png')