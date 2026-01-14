from rest_framework import serializers
from .models import Links
from .utils import generate_code
from rest_framework.reverse import reverse


class ShortURLListSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField(read_only=True)
    update_url = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Links
        fields = ("id", "original_url", "short_url", "update_url", "clicks", "is_active", "created_at")

    def get_short_url(self, obj):
        request = self.context.get("request")
        url = reverse("redirect-url", args=[obj.short_url], request=request)
        return url
    
    def get_update_url(self, obj):
        request = self.context.get("request")
        url = reverse("url-update", args=[obj.pk], request=request)
        return url
    
    def create(self, validated_data):
        user = self.context["request"].user
        return Links.objects.create(
            user=user,
            original_url=validated_data["original_url"],
            short_url=generate_code()
        )
    

    
