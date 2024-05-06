from django.shortcuts import render
import os
from django.views.generic.detail import DetailView
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import get_object_or_404 
from .models import Like
from stores.models import Property
from django.views import View
from django.views.generic import ListView
from django.db.models import Avg
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

class PropertyDetailView(LoginRequiredMixin, DetailView):
    model = Property
    template_name = os.path.join('stores', 'property_detail.html')
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        like_count = self.object.like_set.count()
        # ポストに対するイイね数
        context['like_count'] = like_count
        # ログイン中のユーザーがイイねしているかどうか
        if self.object.like_set.filter(like=self.request.user).exists():
            context['is_user_liked'] = True
        else:
            context['is_user_liked'] = False

        return context

def like(request):
    property_pk = request.POST.get('property_pk')
    context = {
        'user': request.user.username,
    }
    post = get_object_or_404(Property, pk=property_pk)
    like = Like.objects.filter(property=post, like=request.user)

    if like.exists():
        like.delete()
        context['method'] = 'delete'
    else:
        like.create(property=post, like=request.user)
        context['method'] = 'create'

    context['like_count'] = post.like_set.count()

    return JsonResponse(context)

class LikeStatusView(View):
    def get(self, request, *args, **kwargs):
        property_id = self.request.GET.get('property_pk')
        property_instance = get_object_or_404(Property, pk=property_id)
        
        # ログイン中のユーザーがイイねしているかどうかの判定
        is_user_liked = property_instance.like_set.filter(like=self.request.user).exists()

        # レスポンスの構築
        response_data = {
            'like_count': property_instance.like_set.count(),
            'is_user_liked': is_user_liked,
        }

        return JsonResponse(response_data)
    
class UserLikeListView(LoginRequiredMixin, ListView):
    model = Like
    template_name = os.path.join('stores', 'like_list.html')
    paginate_by = 5

    def get_queryset(self):
        query = super().get_queryset()
        user_likes = Like.objects.filter(like_id=self.request.user.id)
        query = Property.objects.filter(id__in=user_likes.values('property_id'))
        
        selected_areas = self.request.GET.getlist('area')

        if selected_areas:
            query = query.filter(
                ward_id__in=selected_areas
            )
        selected_layouts = self.request.GET.getlist('layout')

        if selected_layouts:
            query = query.filter(propertydetail__layout__in=selected_layouts)

        selected_types = self.request.GET.getlist('type')

        if selected_types:
            query = query.filter(property_type__id__in=selected_types)


        low_price = self.request.GET.get('low_price')
        high_price = self.request.GET.get('high_price')

        if low_price and high_price:
            query = query.filter(propertydetail__rent__range=(low_price, high_price))
        elif low_price:
            query = query.filter(propertydetail__rent__gte=low_price)
        elif high_price:
            query = query.filter(propertydetail__rent__lte=high_price)

        price_options = self.request.GET.getlist('price')
        if price_options:
            for option in price_options:
                if option == 'managementFeeValue':
                    query = query.filter(propertydetail__management_fee__lte=0)
                elif option == 'depositKeyMoneyValue':
                    query = query.filter(deposit_key_money__icontains='なし')
                elif option == 'creditValue':
                    query = query.filter(propertydetail__credit=True)


        selected_minute = self.request.GET.get('walkMinute')
        if selected_minute and selected_minute.isdigit():
            query = query.filter(walk_minute__lte=selected_minute)


        selected_years = self.request.GET.get('yearBuilt')
        if selected_years and selected_years.isdigit():
            query = query.filter(year_built__lte=selected_years)

        sort_option = self.request.GET.get('sort')

        if sort_option == 'price_high':
            query = query.order_by('-propertydetail__rent')
        elif sort_option == 'price_low':
            query = query.order_by('propertydetail__rent')
        elif sort_option == 'rate':
            query = query.annotate(avg_rate=Avg('review__rate')).order_by('-avg_rate')
        elif sort_option == 'year_built':
            query = query.order_by('year_built')

        query = query.distinct()

        return query
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # ログインユーザーに関連するお気に入りを絞り込む
        user_likes = Like.objects.filter(like_id=self.request.user.id)
        context['user_likes'] = user_likes

        context['property_type_name'] = self.request.GET.get('property_type_name', '')
        context['property_name'] = self.request.GET.get('property_name', '')
        context['low_price'] = self.request.GET.get('low_price', '')
        context['high_price'] = self.request.GET.get('high_price', '')
        context['selected_areas'] = self.request.GET.getlist('area', '')
        context['price_options'] = self.request.GET.getlist('price', '')
        context['selected_layout'] = self.request.GET.getlist('layout', '')
        context['selected_minute'] = self.request.GET.getlist('walkMinute', '')
        context['selected_years'] = self.request.GET.getlist('yearBuilt', '')
        context['selected_type'] = self.request.GET.getlist('type', '')
        context['sort_option'] = self.request.GET.get('sort', '')
        context['total_items'] = self.get_queryset().count()

        properties = context['object_list']
        paginator = Paginator(properties, self.paginate_by)

        page_number = self.request.GET.get('page')
        try:
            properties = paginator.page(page_number)
        except PageNotAnInteger:
            properties = paginator.page(1)
        except EmptyPage:
            properties = paginator.page(paginator.num_pages)

        context['properties'] = properties

        return context