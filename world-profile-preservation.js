/* Pure migration and location-family purchase rules; deliberately does not access browser storage.
   Call from app.js only when the app-level integration has been reviewed and tested. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.RevisionWorldProfileSafety=Object.freeze(api);
})(typeof window==='object'?window:null,function(){
  'use strict';
  const ALIASES=Object.freeze({
    capetown:'capetown',cape_town:'capetown',
    addis:'addis',addis_ababa:'addis',
    victoriafalls:'victoriafalls',victoria_falls:'victoriafalls'
  });
  const GROUPS=Object.freeze({
    capetown:Object.freeze(['capetown','cape_town']),
    addis:Object.freeze(['addis','addis_ababa']),
    victoriafalls:Object.freeze(['victoriafalls','victoria_falls'])
  });
  const family=id=>GROUPS[ALIASES[id]]||[id];
  const isPlainObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const uniqueStrings=(list,fallback=[])=>[...new Set((Array.isArray(list)?list:fallback).filter(x=>typeof x==='string'&&x.length>0))];
  const positiveOrZero=value=>{
    const n=typeof value==='number'?value:(typeof value==='string'&&value.trim()?Number(value):0);
    return Number.isFinite(n)?Math.max(0,n):0;
  };
  function migrateProfile(saved){
    const initial=isPlainObject(saved)?saved:{};
    const current=isPlainObject(initial.shopOwned)?initial.shopOwned:{};
    // All unknown historical purchased IDs remain: a future roster may reintroduce them.
    const chars=uniqueStrings(current.characters);
    const outfits=uniqueStrings(current.outfits);
    const locations=uniqueStrings(current.locations);
    if(!chars.includes('lelouch'))chars.unshift('lelouch');
    if(!outfits.includes('lelouch-default'))outfits.unshift('lelouch-default');
    if(!locations.includes('london'))locations.unshift('london');
    return {
      ...initial,
      economyVersion:2,
      points:positiveOrZero(initial.points),
      lifetimeXp:positiveOrZero(initial.lifetimeXp),
      reviews:positiveOrZero(initial.reviews),
      shopOwned:{...current,characters:chars,outfits,locations},
      equippedCharacter:typeof initial.equippedCharacter==='string'&&chars.includes(initial.equippedCharacter)?initial.equippedCharacter:'lelouch',
      equippedOutfit:typeof initial.equippedOutfit==='string'&&outfits.includes(initial.equippedOutfit)?initial.equippedOutfit:'lelouch-default',
      equippedLocation:typeof initial.equippedLocation==='string'&&locations.includes(initial.equippedLocation)?initial.equippedLocation:'london'
    };
  }
  function isOwnedLocation(profile,id){
    const owned=profile?.shopOwned?.locations;
    return Array.isArray(owned)&&family(id).some(variant=>owned.includes(variant));
  }
  function ownedLocationFor(profile,id){
    const owned=profile?.shopOwned?.locations||[];
    const members=family(id);
    return members.find(variant=>owned.includes(variant))||null;
  }
  function purchaseLocation(rawProfile,location){
    if(!location||typeof location.id!=='string'||!Number.isFinite(location.cost)||location.cost<0)
      throw new TypeError('Expected valid location ID and nonnegative point price');
    const p=migrateProfile(rawProfile),already=ownedLocationFor(p,location.id);
    if(already)return {profile:{...p,equippedLocation:already},deducted:0,alreadyOwned:true,equippedId:already};
    if(p.points<location.cost)return {profile:p,deducted:0,alreadyOwned:false,insufficientPoints:true,equippedId:p.equippedLocation};
    return {
      profile:{...p,points:p.points-location.cost,shopOwned:{...p.shopOwned,locations:[...p.shopOwned.locations,location.id]},equippedLocation:location.id},
      deducted:location.cost,alreadyOwned:false,insufficientPoints:false,equippedId:location.id
    };
  }
  function distinctLocations(locations){
    if(!Array.isArray(locations))return [];
    const seen=new Set();
    return locations.filter(place=>{
      const id=ALIASES[place.id]||place.id;
      if(seen.has(id))return false;
      seen.add(id);return true;
    });
  }
  return Object.freeze({ALIASES,GROUPS,family,migrateProfile,isOwnedLocation,ownedLocationFor,purchaseLocation,distinctLocations});
});
